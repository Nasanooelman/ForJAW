// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "PizzaModel.generated.h"

class UStaticMeshComponent;
UCLASS()
class SALAMISAM_API APizzaModel : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	APizzaModel();
	//UStaticMeshComponent LoadMesh(UStaticMeshComponent* Comp, FString Path, FString Name);

protected:
	// Called when the game starts or when spawned
	virtual void BeginPlay() override;

private:
	UStaticMeshComponent* PizzaBase;
	UStaticMeshComponent* PizzaSauce;
	UStaticMeshComponent* ToppingOne;
	UStaticMeshComponent* ToppingTwo;
	UStaticMeshComponent* ToppingThree;
	UStaticMeshComponent* ToppingFour;
};
