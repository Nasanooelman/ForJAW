// Fill out your copyright notice in the Description page of Project Settings.


#include "PizzaModel.h"
#include "Components/StaticMeshComponent.h"

// Sets default values
APizzaModel::APizzaModel()
{
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	//PizzaBase = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("mesh"));
	
}

//UStaticMeshComponent APizzaModel::LoadMesh(UStaticMeshComponent* Comp, FString Path, FString Name)
//{
//
//	//FString PathName = "'StaticMesh' " + Path;
//	//static ConstructorHelpers::FObjectFinder<UStaticMesh> ModelPath(TEXT(PathName));
//	//mesh->AttachTo(RootComponent);
//	//Comp->SetStaticMesh(ModelPath.Object);
//
//	return NULL;
//}

// Called when the game starts or when spawned
void APizzaModel::BeginPlay()
{
	Super::BeginPlay();	
}
